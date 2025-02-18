import PaddedScreen from "@/components/shared/paddedScreen";
import SafeScreen from "@/components/shared/safeScreen";
import Colors, { colors } from "@/constants/Colors";
import { c } from "@/utils/fontStyles";
import { wHFull } from "@/utils/imageStyles";
import { bg, flexYCenter, h, mt, w, wFull, absolute, b, border, flex, itemsCenter, justifyBetween, rounded, py, px, pYAuto, } from "@/utils/styles";
import { Entypo } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Menu, Text } from "react-native-paper";

function MenuTile({ label, options, onSelect }: {
    label: string,
    options: any[],
    onSelect: (option: string) => void
}) {

    let [visible, setVisible] = useState(false);

    const toggleMenu = () => setVisible(prev => (!prev));

    const closeMenu = () => setVisible(false);

    return (
        <View style={[wFull, h('auto'), flexYCenter, { gap: 16 }]}>
            {true && <View
                style={[wFull, { height: 'auto' }]}
            >
                <Menu
                    style={[w('90%'), mt(47), bg(colors.white), border(0.7, colors.transparent), rounded(0), h('auto')]}
                    contentStyle={[w('90%'), mt(47), bg(colors.white), border(0.7, colors.transparent), rounded(0), wFull, h('auto'), { marginTop: 0, paddingTop: 0 }]}
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                        <TouchableOpacity onPress={toggleMenu}>
                            <View style={[wFull, flex, itemsCenter, justifyBetween, border(0.7, '#D7D7D7'), rounded(10), wFull, h(50), bg('#F9F7F8'), py('auto'), px(24)]}>
                                <Text style={[bg('#F9F7F8'), pYAuto, c(Colors.light.darkGrey), { textTransform: 'capitalize', }]}>
                                    {/* {status === 'idle' && values.question === '' ? 'Select Question' : values.question} */}
                                    {label}
                                </Text>

                                <Entypo
                                    name="chevron-small-down"
                                    size={35}
                                    color={Colors.light.darkGrey}
                                    style={{
                                        transform: [{ rotate: !visible ? '0deg' : '180deg' }]
                                    }}
                                />
                            </View>
                        </TouchableOpacity>
                    }>

                    {options.map((option, index) => (
                        <Menu.Item style={[bg(colors.white), wFull, index > 0 && mt(-10)]} onPress={() => {
                            onSelect(option)
                            // handleChange('option')(option);
                            // setStatus('selected')
                            // closeMenu()
                        }} title={<Text style={[bg(colors.white), wFull, c(Colors.light.darkGrey)]}>{option}</Text>} key={index} />
                    ))}
                </Menu>
            </View>}

        </View>
    )
}

export default MenuTile;