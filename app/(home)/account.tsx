import { c } from "@/utils/fontStyles";
import { wHFull } from "@/utils/imageStyles";
import { bg, flex, itemsCenter, justifyCenter } from "@/utils/styles";
import { View } from "react-native";
import { Text } from "react-native-paper";


function Offer() {

    return (
        <View style={[flex, itemsCenter, justifyCenter, bg('purple'), wHFull]}>
            <Text style={[c('white')]}>Offer</Text>
        </View>
    )
}

export default Offer;

