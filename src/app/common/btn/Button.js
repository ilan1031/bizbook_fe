"use client";
import React, { memo } from "react";
import { Button as MuiButton, CircularProgress, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Constants
export const BUTTON_VARIANTS = {
  contained: "contained",
  outlined: "outlined",
  text: "text",
};

export const BUTTON_BORDER_STYLES = {
  solid: "solid",
  dashed: "dashed",
  dotted: "dotted",
  double: "double",
};

export const BUTTON_SIZES = {
  small: "small",
  medium: "medium",
  large: "large",
};

export const BUTTON_ANIMATIONS = {
  none: "none",
  pulse: "pulse",
  bounce: "bounce",
  shake: "shake",
};

export const BUTTON_HOVER_EFFECTS = {
  opacity: "opacity",
  scale: "scale",
  none: "none",
};

// Button Component
const Button = memo(
  ({
    type = "button",
    color = "primary",
    variant = BUTTON_VARIANTS.contained,
    onClick,
    disabled = false,
    className = "",
    size = BUTTON_SIZES.medium,
    isLoading = false,
    fullWidth = false,
    startIcon,
    endIcon,
    withConfirm = false,
    confirmMessage = "Are you sure?",
    tooltip = "",
    elevated = false,
    borderRadius = 4,
    borderColor,
    borderStyle = BUTTON_BORDER_STYLES.solid,
    fontSize,
    fontWeight,
    animation = BUTTON_ANIMATIONS.none,
    hoverEffect = BUTTON_HOVER_EFFECTS.opacity,
    hoverScale = 1.05,
    hoverBackgroundColor,
    children,
  }) => {
    const theme = useTheme();

    // Theme-aware color handling
    const getColorFromTheme = (colorKey) => {
      const base = theme.palette[colorKey] ||
        theme.palette.custom?.[colorKey] || {
          main: "#408dfb",
          contrastText: "#FFFFFF",
          light: "#E6F0FF",
        };

      return {
        main: base.main,
        contrastText: base.contrastText || "#fff",
        light: base.light || "#eee",
      };
    };

    const buttonColor = getColorFromTheme(color);
    const actualBorderColor = borderColor || buttonColor.main;

    const handleClick = (e) => {
      if (withConfirm && window.confirm(confirmMessage)) {
        onClick?.(e);
      } else if (!withConfirm) {
        onClick?.(e);
      }
    };

    const spinnerColor =
      variant === BUTTON_VARIANTS.contained
        ? buttonColor.contrastText
        : buttonColor.main;

    const getAnimationStyles = () => {
      if (animation === BUTTON_ANIMATIONS.none) return {};
      const styles = {};
      let animationValue = "";
      if (animation === BUTTON_ANIMATIONS.pulse) {
        animationValue = "pulse 2s infinite";
        styles["@keyframes pulse"] = {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        };
      } else if (animation === BUTTON_ANIMATIONS.bounce) {
        animationValue = "bounce 1s infinite";
        styles["@keyframes bounce"] = {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        };
      } else if (animation === BUTTON_ANIMATIONS.shake) {
        animationValue = "shake 0.82s both";
        styles["@keyframes shake"] = {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(4px, 0, 0)" },
        };
      }
      return {
        animation: animationValue,
        ...styles,
      };
    };
    const getHoverStyles = () => {
      return {
        opacity: hoverEffect === BUTTON_HOVER_EFFECTS.opacity ? 0.8 : 1,
        transform:
          hoverEffect === BUTTON_HOVER_EFFECTS.scale
            ? `scale(${hoverScale})`
            : "none",
        backgroundColor:
          hoverBackgroundColor || theme.palette.hover?.background || undefined,
        color: theme.palette.hover?.text || undefined,
      };
    };

    const buttonSx = {
      position: "relative",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      fontWeight: fontWeight || 600,
      fontSize: "12px",
      borderRadius: `${borderRadius}px`,
      boxShadow: elevated && variant === BUTTON_VARIANTS.contained ? 3 : 0,
      transition: "all 0.3s ease",
      ...getAnimationStyles(),

      ...(variant === BUTTON_VARIANTS.contained && {
        backgroundColor: buttonColor.main,
        color: buttonColor.contrastText,
        "&:hover": {
          backgroundColor: hoverBackgroundColor || buttonColor.main,
          boxShadow: elevated ? 6 : 0,
          ...getHoverStyles(),
        },
      }),

      ...(variant === BUTTON_VARIANTS.outlined && {
        color: buttonColor.main,
        borderColor: actualBorderColor,
        borderStyle,
        borderWidth: "1px",
        "&:hover": {
          backgroundColor: hoverBackgroundColor || buttonColor.light,
          borderColor: actualBorderColor,
          ...getHoverStyles(),
        },
      }),

      ...(variant === BUTTON_VARIANTS.text && {
        color: buttonColor.main,
        "&:hover": {
          backgroundColor: hoverBackgroundColor || buttonColor.light,
          ...getHoverStyles(),
        },
      }),
    };

    const buttonElement = (
      <MuiButton
        type={type}
        variant={variant}
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={className}
        size={size}
        fullWidth={fullWidth}
        startIcon={!isLoading && startIcon}
        endIcon={!isLoading && endIcon}
        disableElevation={!elevated}
        sx={buttonSx}
      >
        {isLoading && (
          <CircularProgress
            size={24}
            sx={{
              position: "absolute",
              color: spinnerColor,
            }}
          />
        )}
        <span style={{ visibility: isLoading ? "hidden" : "visible" }}>
          {children}
        </span>
      </MuiButton>
    );

    return tooltip ? (
      <Tooltip title={tooltip} arrow>
        {buttonElement}
      </Tooltip>
    ) : (
      buttonElement
    );
  }
);

Button.displayName = "Button";
export default Button;
