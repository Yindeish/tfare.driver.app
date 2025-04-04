"use client"

import type React from "react"
import { createContext, useContext, type ReactNode } from "react"
import { type ViewStyle, type TextStyle, Text, View } from "react-native"
import { TooltipPosition } from "./use-tooltip"
import tw from "@/constants/tw"

export interface TooltipContextProps {
  defaultPosition?: TooltipPosition
  defaultOffset?: number
  defaultAnimationDuration?: number
  defaultAutoAdjust?: boolean
  defaultTooltipStyle?: ViewStyle
  defaultTooltipTextStyle?: TextStyle
  defaultArrowStyle?: ViewStyle
}

const TooltipContext = createContext<TooltipContextProps>({
  defaultPosition: "top",
  defaultOffset: 8,
  defaultAnimationDuration: 200,
  defaultAutoAdjust: true,
})

export interface TooltipProviderProps extends TooltipContextProps {
  children: ReactNode
}

export const TooltipProvider: React.FC<TooltipProviderProps> = ({
  children,
  defaultPosition = "top",
  defaultOffset = 8,
  defaultAnimationDuration = 200,
  defaultAutoAdjust = true,
  defaultTooltipStyle,
  defaultTooltipTextStyle,
  defaultArrowStyle,
}) => {
  return (
    <TooltipContext.Provider
      value={{
        defaultPosition,
        defaultOffset,
        defaultAnimationDuration,
        defaultAutoAdjust,
        defaultTooltipStyle,
        defaultTooltipTextStyle,
        defaultArrowStyle,
      }}
    >
      <View style={[tw `fixed bg-red-700 px-[20px] top-0 left-0`]}>
        <Text>{}</Text>
      </View>
      {children}
    </TooltipContext.Provider>
  )
}

export const useTooltipContext = () => useContext(TooltipContext)

