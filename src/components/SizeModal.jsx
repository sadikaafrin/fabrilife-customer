// SizeModal.jsx
import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Grid, Typography, Box, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useVariants from "../data/useVariants";

function normalizeColorObject(c) {
  if (!c) return null;
  return {
    id: c.id ?? c.value ?? null,
    name: (c.label || c.name || c.color || "").toString().trim(),
    hex: (c.hex || c.hexCode || c.value || null),
    stock: Number(c.stock ?? c.qty ?? 0),
  };
}

function SizeModal({ product, open, onClose, onSelectionComplete, productSizes = [], productColors = [] }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  // Fetch variants for the current product
  const { variants, loading: variantsLoading, error: variantsError } = useVariants(product?.id);

  useEffect(() => {
    if (open) {
      setSelectedSize(null);
      setSelectedColor(null);
    }
  }, [open, product]);

  if (!product) return null;

  const hasSizes = productSizes && productSizes.length > 0;
  const hasColors = productColors && productColors.length > 0;

  // Variant validation logic
  const getAvailableSizes = () => {
    if (!variants || variants.length === 0) return productSizes;

    const selectedColorName = selectedColor ? normalizeColorObject(selectedColor)?.name || "" : "";

    if (!selectedColorName) {
      // No color selected, return all sizes that have variants
      const availableSizeLabels = [...new Set(
        variants
          .filter(v => v.size && v.size.toString().trim() !== "")
          .map(v => v.size.toString().trim())
      )];
      
      return productSizes.filter(s => 
        availableSizeLabels.some(label => 
          label.toLowerCase() === (s.label || "").toString().trim().toLowerCase()
        )
      );
    }

    // Color is selected, filter sizes based on available variants
    const availableSizeLabels = [...new Set(
      variants
        .filter(variant => {
          const variantColor = (variant.color || "").toString().trim();
          const variantSize = (variant.size || "").toString().trim();
          
          // Match color (or variant has no color restriction)
          const colorMatch = variantColor === "" || variantColor.toLowerCase() === selectedColorName.toLowerCase();
          
          return colorMatch && variantSize !== "";
        })
        .map(v => v.size.toString().trim())
    )];

    return productSizes.filter(s => 
      availableSizeLabels.some(label => 
        label.toLowerCase() === (s.label || "").toString().trim().toLowerCase()
      )
    );
  };

  const getAvailableColors = () => {
    if (!variants || variants.length === 0) return productColors;

    const selectedSizeLabel = selectedSize || "";

    if (!selectedSizeLabel) {
      // No size selected, return all colors that have variants
      const availableColorLabels = [...new Set(
        variants
          .filter(v => v.color && v.color.toString().trim() !== "")
          .map(v => v.color.toString().trim())
      )];
      
      return productColors.filter(c => {
        const colorLabel = (c.label || c.name || c.color || "").toString().trim();
        return availableColorLabels.some(label => 
          label.toLowerCase() === colorLabel.toLowerCase()
        );
      });
    }

    // Size is selected, filter colors based on available variants
    const availableColorLabels = [...new Set(
      variants
        .filter(variant => {
          const variantSize = (variant.size || "").toString().trim();
          const variantColor = (variant.color || "").toString().trim();
          
          // Match size (or variant has no size restriction)
          const sizeMatch = variantSize === "" || variantSize.toLowerCase() === selectedSizeLabel.toLowerCase();
          
          return sizeMatch && variantColor !== "";
        })
        .map(v => v.color.toString().trim())
    )];

    return productColors.filter(c => {
      const colorLabel = (c.label || c.name || c.color || "").toString().trim();
      return availableColorLabels.some(label => 
        label.toLowerCase() === colorLabel.toLowerCase()
      );
    });
  };

  const availableSizes = getAvailableSizes();
  const availableColors = getAvailableColors();

  const getSizeStock = (sizeLabel) => {
    if (!variants || variants.length === 0) {
      const s = productSizes.find(x => x.label === sizeLabel);
      return s ? Number(s.stock || 0) : 0;
    }
    const selectedColorName = selectedColor ? normalizeColorObject(selectedColor)?.name || "" : "";
    const matchingVariants = variants.filter(v => {
      const vSize = (v.size || "").toString().trim();
      const vColor = (v.color || "").toString().trim();
      const sizeMatch = vSize.toLowerCase() === sizeLabel.toLowerCase() || vSize === "";
      const colorMatch = selectedColorName === "" || vColor === "" || vColor.toLowerCase() === selectedColorName.toLowerCase();
      return sizeMatch && colorMatch;
    });
    return matchingVariants.reduce((sum, v) => sum + Number(v.available_stock || 0), 0);
  };

  const getColorStock = (colorObj) => {
    const colorName = (colorObj.label || colorObj.name || colorObj.color || "").toString().trim();
    if (!variants || variants.length === 0) {
      const c = productColors.find(x => {
        const xName = (x.label || x.name || x.color || "").toString().trim();
        return xName.toLowerCase() === colorName.toLowerCase();
      });
      return c ? Number(c.stock || 0) : 0;
    }
    const selectedSizeLabel = selectedSize || "";
    const matchingVariants = variants.filter(v => {
      const vSize = (v.size || "").toString().trim();
      const vColor = (v.color || "").toString().trim();
      const colorMatch = vColor.toLowerCase() === colorName.toLowerCase() || vColor === "";
      const sizeMatch = selectedSizeLabel === "" || vSize === "" || vSize.toLowerCase() === selectedSizeLabel.toLowerCase();
      return sizeMatch && colorMatch;
    });
    return matchingVariants.reduce((sum, v) => sum + Number(v.available_stock || 0), 0);
  };

  // Check if a specific size is available based on current color selection
  const isSizeAvailable = (sizeLabel) => {
    return availableSizes.some(s => 
      (s.label || "").toString().trim().toLowerCase() === sizeLabel.toLowerCase()
    );
  };

  // Check if a specific color is available based on current size selection
  const isColorAvailable = (colorObj) => {
    const colorLabel = (colorObj.label || colorObj.name || colorObj.color || "").toString().trim();
    return availableColors.some(c => {
      const cLabel = (c.label || c.name || c.color || "").toString().trim();
      return cLabel.toLowerCase() === colorLabel.toLowerCase();
    });
  };

  const canAddToCart =
    (!hasSizes || selectedSize !== null) &&
    (!hasColors || selectedColor !== null);

  const handleSizeClick = (sizeLabel) => {
    if (selectedSize === sizeLabel) {
      // Deselect if clicking the same size
      setSelectedSize(null);
    } else {
      setSelectedSize(sizeLabel);
      // Don't clear color - allow simultaneous selection
    }
  };

  const handleColorClick = (colorObj) => {
    const normalizedColor = normalizeColorObject(colorObj);
    const isSame = selectedColor && normalizedColor && 
      (selectedColor.id === normalizedColor.id || 
       selectedColor.name.toLowerCase() === normalizedColor.name.toLowerCase());
    
    if (isSame) {
      // Deselect if clicking the same color
      setSelectedColor(null);
    } else {
      setSelectedColor(colorObj);
      // Don't clear size - allow simultaneous selection
    }
  };

  const handleAddToCart = () => {
    if (!canAddToCart) return;

    if (selectedSize && getSizeStock(selectedSize) <= 0) return;

    const normalizedColor = selectedColor ? normalizeColorObject(selectedColor) : null;
    // If color or size is out of stock, block
    if (normalizedColor && getColorStock(normalizedColor) <= 0) return;

    // Find matching variant and get SKU
    let variantSKU = null;
    if (variants && variants.length > 0) {
      const selectedColorName = normalizedColor?.name || "";
      const selectedSizeLabel = selectedSize || "";

      const matchingVariant = variants.find(variant => {
        const variantSize = (variant.size || "").toString().trim();
        const variantColor = (variant.color || "").toString().trim();
        
        const sizeMatch = selectedSizeLabel === "" || variantSize === "" || variantSize.toLowerCase() === selectedSizeLabel.toLowerCase();
        const colorMatch = selectedColorName === "" || variantColor === "" || variantColor.toLowerCase() === selectedColorName.toLowerCase();
        
        return sizeMatch && colorMatch;
      });

      if (matchingVariant && matchingVariant.sku) {
        variantSKU = matchingVariant.sku;
      }
    }

    onSelectionComplete(
      hasSizes ? selectedSize : null, 
      hasColors ? normalizedColor : null,
      variantSKU
    );

    setSelectedSize(null);
    setSelectedColor(null);
  };

  const getColorHex = (c) => {
    return c?.hex || c?.value || c?.hexCode || "#cccccc";
  };

  const isColorSelected = (rawColor) => {
    if (!selectedColor || !rawColor) return false;
    const sel = normalizeColorObject(selectedColor);
    const r = normalizeColorObject(rawColor);
    if (!sel || !r) return false;
    if (sel.id && r.id) return String(sel.id) === String(r.id);
    return sel.name.toLowerCase() === r.name.toLowerCase();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 24,
          padding: "22px",
          position: "relative",
          overflow: "visible",
        },
      }}
    >
      <IconButton onClick={onClose} sx={{ position: "absolute", right: 10, top: 10, bgcolor: "#f1f1f1", "&:hover": { bgcolor: "#e0e0e0" } }}>
        <CloseIcon />
      </IconButton>

      <DialogTitle sx={{ textAlign: "center", fontWeight: 700, letterSpacing: 0.5, pb: 1, fontSize: "1.2rem" }}>
        Choose Your Options
      </DialogTitle>

      <DialogContent sx={{ pt: 1, pb: 2 }}>
        {hasSizes && (
          <>
            <Typography sx={{ fontWeight: 600, mb: 1.5, fontSize: "0.95rem" }}>
              Select Size <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <Grid container spacing={1.5} sx={{ mb: 3 }}>
              {productSizes.map((s) => {
                const available = isSizeAvailable(s.label);
                const sizeStock = getSizeStock(s.label);
                const isDisabled = !available || sizeStock <= 0;
                
                // Hide unavailable sizes completely
                if (!available) return null;
                
                return (
                  <Grid item key={s.id ?? s.label}>
                    <Box
                      onClick={() => !isDisabled && handleSizeClick(s.label)}
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        cursor: !isDisabled ? "pointer" : "not-allowed",
                        opacity: !isDisabled ? 1 : 0.3,
                        border: selectedSize === s.label ? "2.5px solid #000" : "2px solid #dcdcdc",
                        bgcolor: selectedSize === s.label ? "#000" : "transparent",
                        color: selectedSize === s.label ? "#fff" : "#333",
                        "&:hover": {
                          transform: !isDisabled ? "scale(1.08)" : "none",
                        },
                        transition: "all 0.2s",
                      }}
                      title={sizeStock <= 0 ? "Out of stock" : s.label}
                    >
                      {s.label}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </>
        )}

        {hasColors && (
          <>
            <Typography sx={{ fontWeight: 600, mb: 1.5, fontSize: "0.95rem" }}>
              Select Color <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {productColors.map((c) => {
                const isSelected = isColorSelected(c);
                const colorHex = getColorHex(c);
                const stock = getColorStock(c);
                const available = isColorAvailable(c);
                const isDisabled = !available || stock <= 0;

                // Hide unavailable colors completely
                if (!available) return null;

                return (
                  <Grid item key={c.id ?? c.label}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                      <Box
                        onClick={() => !isDisabled && handleColorClick(c)}
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          bgcolor: colorHex,
                          cursor: !isDisabled ? "pointer" : "not-allowed",
                          border: isSelected ? "3.5px solid #000" : "2.5px solid #e0e0e0",
                          boxShadow: isSelected ? "0 4px 12px rgba(0,0,0,0.15)" : "0 2px 4px rgba(0,0,0,0.08)",
                          transition: "all 0.2s",
                          transform: isSelected ? "scale(1.06)" : "none",
                          opacity: !isDisabled ? 1 : 0.3
                        }}
                        title={`${c.label || c.name}${stock <= 0 ? ' - Out of stock' : ''}`}
                      />
                      <Typography sx={{ 
                        fontSize: "0.75rem", 
                        textAlign: "center", 
                        textTransform: "capitalize", 
                        fontWeight: isSelected ? 600 : 400, 
                        color: isSelected ? "#000" : "#666" 
                      }}>
                        {c.label || c.name || 'Color'}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </>
        )}

        <Button
          fullWidth
          variant="contained"
          onClick={handleAddToCart}
          disabled={!canAddToCart}
          sx={{
            mt: 1,
            py: 1.8,
            borderRadius: "12px",
            textTransform: "none",
            fontSize: "15px",
            fontWeight: 600,
            bgcolor: "#000",
            "&:hover": { bgcolor: "#222" },
            "&:disabled": { bgcolor: "#e0e0e0", color: "#999" },
          }}
        >
          {!canAddToCart
            ? `Please Select ${!selectedSize && hasSizes ? 'Size' : ''}${!selectedSize && hasSizes && !selectedColor && hasColors ? ' & ' : ''}${!selectedColor && hasColors ? 'Color' : ''}`
            : 'Add to Cart'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default SizeModal;