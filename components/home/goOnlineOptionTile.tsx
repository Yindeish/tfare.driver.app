import { flex, gap, itemsCenter } from "@/utils/styles";
import { TouchableOpacity, View } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Text } from "react-native-paper";
import { colorBlack, fs14, fw500, neurialGrotesk } from "@/utils/fontStyles";


function GoOnlineOptionTile({ onPress, option }: { option: { name: string, checked: boolean }, onPress: () => void }) {


    return (
        <TouchableOpacity onPress={() => onPress()} style={[flex, itemsCenter, gap(16)]}>
            {option.checked ? (
                <FontAwesome5 name="dot-circle" size={24} color="#27AE65" />
            ) : (
                <FontAwesome5 name="circle" size={24} color="#27AE65" />
            )}

            <Text style={[fw500, fs14, neurialGrotesk, colorBlack]}>{option.name}</Text>
        </TouchableOpacity>
    )
}

export default GoOnlineOptionTile;