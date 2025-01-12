import React from 'react';
import { View, Text, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import { useState } from 'react';
import { colors } from '@/constants/Colors';
import tw from '@/constants/tw';

const Spinner = ({ visible, text }: { visible: boolean, text?: string }) => {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={() => { }}
        >
            <View style={[tw`bg-[#00000005] flex items-center justify-center`, { flex: 1 }]}>
                <View style={[tw`bg-white p-[20px] rounded-[10px] flex items-center justify-center`,]}>
                    <ActivityIndicator size="large" color={colors.grey600} />
                </View>
            </View>
        </Modal>
    );
};


export default Spinner;