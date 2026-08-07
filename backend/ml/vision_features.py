from __future__ import annotations

import numpy as np
from PIL import Image, ImageOps


FEATURE_VERSION = "hog-color-v1"
IMAGE_SIZE = 128
CELL_SIZE = 8
ORIENTATION_BINS = 9


def extract_image_features(image: Image.Image) -> np.ndarray:
    """Compact HOG + spatial colour descriptor for the synthetic showcase classifier."""
    image = ImageOps.exif_transpose(image).convert("RGB").resize(
        (IMAGE_SIZE, IMAGE_SIZE), Image.Resampling.LANCZOS
    )
    rgb = np.asarray(image, dtype=np.float32) / 255.0
    gray = rgb @ np.array([0.299, 0.587, 0.114], dtype=np.float32)

    gradient_y, gradient_x = np.gradient(gray)
    magnitude = np.sqrt(gradient_x ** 2 + gradient_y ** 2)
    orientation = (np.degrees(np.arctan2(gradient_y, gradient_x)) + 180.0) % 180.0

    cells_per_axis = IMAGE_SIZE // CELL_SIZE
    cell_histograms = np.zeros(
        (cells_per_axis, cells_per_axis, ORIENTATION_BINS), dtype=np.float32
    )
    bin_width = 180.0 / ORIENTATION_BINS

    for row in range(cells_per_axis):
        for column in range(cells_per_axis):
            y0, y1 = row * CELL_SIZE, (row + 1) * CELL_SIZE
            x0, x1 = column * CELL_SIZE, (column + 1) * CELL_SIZE
            cell_orientation = orientation[y0:y1, x0:x1].ravel()
            cell_magnitude = magnitude[y0:y1, x0:x1].ravel()
            bins = np.floor(cell_orientation / bin_width).astype(np.int32)
            bins = np.clip(bins, 0, ORIENTATION_BINS - 1)
            cell_histograms[row, column] = np.bincount(
                bins, weights=cell_magnitude, minlength=ORIENTATION_BINS
            )

    hog_blocks = []
    for row in range(cells_per_axis - 1):
        for column in range(cells_per_axis - 1):
            block = cell_histograms[row:row + 2, column:column + 2].ravel()
            block = block / (np.linalg.norm(block) + 1e-6)
            hog_blocks.extend(block.tolist())

    colour_features = []
    grid_size = 4
    cell_pixels = IMAGE_SIZE // grid_size
    for row in range(grid_size):
        for column in range(grid_size):
            patch = rgb[
                row * cell_pixels:(row + 1) * cell_pixels,
                column * cell_pixels:(column + 1) * cell_pixels,
            ]
            for channel in range(3):
                histogram, _ = np.histogram(
                    patch[:, :, channel], bins=8, range=(0.0, 1.0), density=True
                )
                colour_features.extend(histogram.astype(np.float32).tolist())

    global_features = []
    for channel in range(3):
        global_features.extend([
            float(rgb[:, :, channel].mean()),
            float(rgb[:, :, channel].std()),
        ])

    features = np.concatenate([
        np.asarray(hog_blocks, dtype=np.float32),
        np.asarray(colour_features, dtype=np.float32),
        np.asarray(global_features, dtype=np.float32),
    ])
    return features / (np.linalg.norm(features) + 1e-6)
