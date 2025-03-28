"use client"

import { useTooltipContext } from "@/contexts/tolltip-provider"
import { TooltipPosition, useTooltip } from "@/contexts/use-tooltip"
import React, { type ReactNode } from "react"
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  type ViewStyle,
  type TextStyle,
} from "react-native"

export interface InlineTooltipProps {
  content: ReactNode
  children: ReactNode
  position?: TooltipPosition
  offset?: number
  animationDuration?: number
  autoAdjust?: boolean
  tooltipStyle?: ViewStyle
  tooltipTextStyle?: TextStyle
  arrowStyle?: ViewStyle
  onOpen?: () => void
  onClose?: () => void
  disabled?: boolean
  closeOnPress?: boolean
  showOnPress?: boolean
  showOnLongPress?: boolean
  accessible?: boolean
  accessibilityLabel?: string
}

export const InlineTooltip: React.FC<InlineTooltipProps> = ({
  content,
  children,
  position,
  offset,
  animationDuration,
  autoAdjust,
  tooltipStyle,
  tooltipTextStyle,
  arrowStyle,
  onOpen,
  onClose,
  disabled = false,
  closeOnPress = true,
  showOnPress = true,
  showOnLongPress = false,
  accessible = true,
  accessibilityLabel = "Tooltip",
}) => {
  const {
    defaultPosition,
    defaultOffset,
    defaultAnimationDuration,
    defaultAutoAdjust,
    defaultTooltipStyle,
    defaultTooltipTextStyle,
    defaultArrowStyle,
  } = useTooltipContext()

  const tooltip = useTooltip({
    position: position || defaultPosition,
    offset: offset !== undefined ? offset : defaultOffset,
    animationDuration: animationDuration !== undefined ? animationDuration : defaultAnimationDuration,
    autoAdjust: autoAdjust !== undefined ? autoAdjust : defaultAutoAdjust,
  })

  const {
    isVisible,
    opacity,
    tooltipPosition,
    tooltipStyle: calculatedTooltipStyle,
    arrowStyle: calculatedArrowStyle,
    showTooltip,
    hideTooltip,
    targetRef,
    tooltipRef,
    onTargetLayout,
    onTooltipLayout,
  } = tooltip

  // Handle open/close callbacks
  React.useEffect(() => {
    if (isVisible && onOpen) {
      onOpen()
    } else if (!isVisible && onClose) {
      onClose()
    }
  }, [isVisible, onOpen, onClose])

  const handlePress = () => {
    if (disabled) return

    if (isVisible && closeOnPress) {
      hideTooltip()
    } else if (showOnPress) {
      showTooltip()
    }
  }

  const handleLongPress = () => {
    if (disabled || !showOnLongPress) return
    showTooltip()
  }

  // Combine default styles with custom styles
  const combinedTooltipStyle = StyleSheet.flatten([calculatedTooltipStyle, defaultTooltipStyle, tooltipStyle])

  const combinedArrowStyle = StyleSheet.flatten([calculatedArrowStyle, defaultArrowStyle, arrowStyle])

  // Render tooltip content
  const renderContent = () => {
    if (typeof content === "string") {
      return <Text style={[styles.tooltipText, defaultTooltipTextStyle, tooltipTextStyle]}>{content}</Text>
    }
    return content
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={handlePress}
        onLongPress={handleLongPress}
        accessible={accessible}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityHint="Shows additional information"
      >
        <View ref={targetRef} onLayout={onTargetLayout}>
          {children}
        </View>
      </TouchableWithoutFeedback>

      {isVisible && (
        <Animated.View
          ref={tooltipRef}
          onLayout={onTooltipLayout}
          style={[combinedTooltipStyle, tooltipPosition, { opacity }]}
          pointerEvents="none"
        >
          {renderContent()}
          <View style={combinedArrowStyle} />
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  tooltipText: {
    color: "white",
    fontSize: 14,
  },
})

