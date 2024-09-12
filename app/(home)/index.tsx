import { useSession } from "@/contexts/userSignedInContext";
import { View } from "react-native";
import { Text } from "react-native-paper";

const index = () => {
    const { signOut } = useSession()
    // signOut();

    return (
        <View>
            <Text>Index</Text>
        </View>
    )
};

export default index;