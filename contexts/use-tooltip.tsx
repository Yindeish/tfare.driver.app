"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Animated, Dimensions, type LayoutRectangle, type LayoutChangeEvent, type ViewStyle } from "react-native"

export type TooltipPosition = "top" | "bottom" | "left" | "right"

export interface TooltipState {
  isVisible: boolean
  position: TooltipPosition
  targetLayout: LayoutRectangle | null
  tooltipLayout: LayoutRectangle | null
}

export interface UseTooltipOptions {
  position?: TooltipPosition
  offset?: number
  animationDuration?: number
  autoAdjust?: boolean
}

export interface UseTooltipResult {
  isVisible: boolean
  opacity: Animated.Value
  tooltipPosition: { top?: number; bottom?: number; left?: number; right?: number }
  tooltipStyle: ViewStyle
  arrowStyle: ViewStyle
  showTooltip: () => void
  hideTooltip: () => void
  toggleTooltip: () => void
  targetRef: React.RefObject<any>
  tooltipRef: React.RefObject<any>
  onTargetLayout: (event: LayoutChangeEvent) => void
  onTooltipLayout: (event: LayoutChangeEvent) => void
}

export const useTooltip = ({
  position = "top",
  offset = 8,
  animationDuration = 200,
  autoAdjust = true,
}: UseTooltipOptions = {}): UseTooltipResult => {
  const [state, setState] = useState<TooltipState>({
    isVisible: false,
    position,
    targetLayout: null,
    tooltipLayout: null,
  })

  const targetRef = useRef<any>(null)
  const tooltipRef = useRef<any>(null)
  const opacity = useRef(new Animated.Value(0)).current

  // Handle animation when visibility changes
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: state.isVisible ? 1 : 0,
      duration: animationDuration,
      useNativeDriver: true,
    }).start()
  }, [state.isVisible, opacity, animationDuration])

  // Calculate tooltip position based on target and tooltip layouts
  const calculatePosition = (): { top?: number; bottom?: number; left?: number; right?: number } => {
    const { targetLayout, tooltipLayout, position } = state

    if (!targetLayout || !tooltipLayout) {
      return {}
    }

    const screenWidth = Dimensions.get("window").width
    const screenHeight = Dimensions.get("window").height

    let calculatedPosition = position

    // Auto-adjust position if tooltip would go off screen
    if (autoAdjust) {
      if (position === "top" && targetLayout.y < tooltipLayout.height + offset) {
        calculatedPosition = "bottom"
      } else if (
        position === "bottom" &&
        targetLayout.y + targetLayout.height + tooltipLayout.height + offset > screenHeight
      ) {
        calculatedPosition = "top"
      } else if (position === "left" && targetLayout.x < tooltipLayout.width + offset) {
        calculatedPosition = "right"
      } else if (
        position === "right" &&
        targetLayout.x + targetLayout.width + tooltipLayout.width + offset > screenWidth
      ) {
        calculatedPosition = "left"
      }
    }

    // Calculate position based on the adjusted position
    switch (calculatedPosition) {
      case "top":
        return {
          left: targetLayout.x + (targetLayout.width - tooltipLayout.width) / 2,
          bottom: screenHeight - targetLayout.y + offset,
        }
      case "bottom":
        return {
          left: targetLayout.x + (targetLayout.width - tooltipLayout.width) / 2,
          top: targetLayout.y + targetLayout.height + offset,
        }
      case "left":
        return {
          right: screenWidth - targetLayout.x + offset,
          top: targetLayout.y + (targetLayout.height - tooltipLayout.height) / 2,
        }
      case "right":
        return {
          left: targetLayout.x + targetLayout.width + offset,
          top: targetLayout.y + (targetLayout.height - tooltipLayout.height) / 2,
        }
      default:
        return {}
    }
  }

  // Calculate arrow style based on position
  const calculateArrowStyle = (): ViewStyle => {
    const { position } = state

    switch (position) {
      case "top":
        return {
          bottom: -8,
          left: "50%",
          marginLeft: -8,
          borderTopWidth: 8,
          borderRightWidth: 8,
          borderBottomWidth: 0,
          borderLeftWidth: 8,
          borderTopColor: "rgba(0, 0, 0, 0.8)",
          borderRightColor: "transparent",
          borderBottomColor: "transparent",
          borderLeftColor: "transparent",
        }
      case "bottom":
        return {
          top: -8,
          left: "50%",
          marginLeft: -8,
          borderTopWidth: 0,
          borderRightWidth: 8,
          borderBottomWidth: 8,
          borderLeftWidth: 8,
          borderTopColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: "rgba(0, 0, 0, 0.8)",
          borderLeftColor: "transparent",
        }
      case "left":
        return {
          right: -8,
          top: "50%",
          marginTop: -8,
          borderTopWidth: 8,
          borderRightWidth: 0,
          borderBottomWidth: 8,
          borderLeftWidth: 8,
          borderTopColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: "transparent",
          borderLeftColor: "rgba(0, 0, 0, 0.8)",
        }
      case "right":
        return {
          left: -8,
          top: "50%",
          marginTop: -8,
          borderTopWidth: 8,
          borderRightWidth: 8,
          borderBottomWidth: 8,
          borderLeftWidth: 0,
          borderTopColor: "transparent",
          borderRightColor: "rgba(0, 0, 0, 0.8)",
          borderBottomColor: "transparent",
          borderLeftColor: "transparent",
        }
      default:
        return {}
    }
  }

  // Event handlers
  const onTargetLayout = (event: LayoutChangeEvent) => {
    setState((prev) => ({
      ...prev,
      targetLayout: event.nativeEvent.layout,
    }))
  }

  const onTooltipLayout = (event: LayoutChangeEvent) => {
    setState((prev) => ({
      ...prev,
      tooltipLayout: event.nativeEvent.layout,
    }))
  }

  const showTooltip = () => {
    setState((prev) => ({ ...prev, isVisible: true }))
  }

  const hideTooltip = () => {
    setState((prev) => ({ ...prev, isVisible: false }))
  }

  const toggleTooltip = () => {
    setState((prev) => ({ ...prev, isVisible: !prev.isVisible }))
  }

  return {
    isVisible: state.isVisible,
    opacity,
    tooltipPosition: calculatePosition(),
    tooltipStyle: {
      position: "absolute",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      borderRadius: 4,
      padding: 8,
    },
    arrowStyle: calculateArrowStyle(),
    showTooltip,
    hideTooltip,
    toggleTooltip,
    targetRef,
    tooltipRef,
    onTargetLayout,
    onTooltipLayout,
  }
}

