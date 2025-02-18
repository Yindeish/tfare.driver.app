import { colors } from "@/constants/Colors";
import { mXAuto } from "@/utils/imageStyles";
import { bg, p, rounded, w } from "@/utils/styles";
import { ReactNode, useState } from "react";
import { Modal as PaperModal, Portal, Text, Button, PaperProvider } from 'react-native-paper';


function Modal({ hideModal, showModal, visible, children }: { visible: boolean, showModal: () => void, hideModal: () => void, children: ReactNode }) {


    return (
        <Portal>
            <PaperModal visible={visible} onDismiss={hideModal} contentContainerStyle={[bg(colors.white), w('80%'), mXAuto, rounded(7)]}>
                {children}
            </PaperModal>
        </Portal>
    )
}

export default Modal;