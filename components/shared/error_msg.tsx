import tw from "@/constants/tw";
import { ReactNode } from "react";
import { Text } from "react-native";



function ErrorMsg({ msg }: { msg: ReactNode }) {


    return (
        <Text style={[tw`text-red-500 text-[10px]`, { fontFamily: 'mont-medium' }]}>{msg}</Text>
    )
}

export default ErrorMsg;