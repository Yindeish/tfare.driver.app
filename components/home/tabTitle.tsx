import { Text } from "react-native-paper";
import { StyleSheet, TextStyle } from "react-native";
import { fonts } from "@/constants/fonts";

function TabBartTitle({ title, color }: { title: string, color: string }) {

    const { titleText } = StyleSheet.create({
        titleText: {
            fontFamily: fonts.neurialGrotesk,
            fontWeight: '400',
            fontSize: 12,
            lineHeight: 24,
            color,
            width: 50,
            textAlign: 'center',
        } as TextStyle
    });

    return (
        <Text style={[titleText,] as TextStyle[]}>{title}</Text>
    )
}

export default TabBartTitle;