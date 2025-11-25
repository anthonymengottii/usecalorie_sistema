// 🚀 DEMO VERSION - Limited functionality for portfolio showcase
/**
 * CalorIA - Camera Screen
 * Food scanning and recognition interface
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Modal,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

import { Button } from '../../components/UI/Button';
import { Heading2, BodyText } from '../../components/UI/Typography';
import { useNavigation } from '../../utils/navigation';
import { COLORS, SPACING } from '../../utils/constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const CameraScreen = () => {
  const navigation = useNavigation();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permisos requeridos',
        'Precisamos de acesso à sua galeria para selecionar fotos'
      );
    }
  };

  const handleTakePhoto = async () => {
    if (!permission) {
      Alert.alert('Erro', 'Não foi possível verificar as permissões da câmera');
      return;
    }

    if (!permission.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
        'Câmera necessária',
        'Precisamos de acesso à sua câmera para tirar fotos dos alimentos'
        );
        return;
      }
    }

    setShowCamera(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        setCapturedPhoto(photo.uri);
        setShowCamera(false);
        
        // Navigate directly to processing
        navigation.navigate('Processing', { imageUri: photo.uri });
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Erro', 'Não foi possível tirar a foto');
      }
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setCapturedPhoto(imageUri);

        // Navigate directly to processing
        navigation.navigate('Processing', { imageUri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
  };

  const handleManualEntry = () => {
    Alert.alert(
      'Entrada Manual',
      'O registro manual de refeições estará disponível em breve. Você poderá buscar alimentos no nosso banco de dados ou criar entradas personalizadas.'
    );
  };

  // Function is no longer needed - navigation handles the flow

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const closeCameraView = () => {
    setShowCamera(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Full Screen Camera Modal */}
      <Modal
        visible={Boolean(showCamera)}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeCameraView}
      >
        <View style={styles.cameraContainer}>
          <StatusBar barStyle="light-content" />
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
          >
            <SafeAreaView style={styles.cameraOverlay}>
              <View style={styles.cameraHeader}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeCameraView}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="close" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.flipButton}
                  onPress={toggleCameraFacing}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="flip-camera-ios" size={28} color="white" />
                </TouchableOpacity>
              </View>

              <View style={styles.cameraFooter}>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={takePicture}
                  activeOpacity={0.8}
                >
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </CameraView>
        </View>
      </Modal>
      <View style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="photo-camera" size={72} color={COLORS.primary} />
          </View>
          <Heading2 style={styles.heroTitle}>
            Escanear refeição
          </Heading2>
          <BodyText align="center" color="textSecondary" style={styles.heroDescription}>
            Tire uma foto da sua refeição e nossa IA identificará automaticamente os alimentos e calculará as calorias.
          </BodyText>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Tirar foto"
            onPress={handleTakePhoto}
            size="large"
            fullWidth
            style={styles.actionButton}
            icon={<MaterialIcons name="photo-camera" size={24} color={COLORS.surface} />}
          />

          <Button
            title="Escolher da galeria"
            onPress={handlePickFromGallery}
            variant="outline"
            size="large"
            fullWidth
            style={styles.actionButton}
            icon={<MaterialIcons name="photo-library" size={24} color={COLORS.primary} />}
          />

          <Button
            title="Entrada Manual"
            onPress={handleManualEntry}
            variant="outline"
            size="large"
            fullWidth
            style={styles.actionButton}
            icon={<MaterialIcons name="edit" size={24} color={COLORS.primary} />}
          />
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <BodyText style={styles.tipsTitle}>
            💡 Dicas para melhores resultados
          </BodyText>
          <View style={styles.tipsList}>
            <BodyText color="textSecondary" style={styles.tipItem}>
              • Garanta uma boa iluminação
            </BodyText>
            <BodyText color="textSecondary" style={styles.tipItem}>
              • Use um fundo claro para destacar o alimento
            </BodyText>
            <BodyText color="textSecondary" style={styles.tipItem}>
              • Inclua toda a porção na foto
            </BodyText>
            <BodyText color="textSecondary" style={styles.tipItem}>
              • Evite sombras sobre o alimento
            </BodyText>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E6F7F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  heroDescription: {
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },
  actions: {
    marginBottom: SPACING.xl,
  },
  actionButton: {
    marginBottom: SPACING.md,
  },
  tipsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SPACING.md,
    color: COLORS.text,
  },
  tipsList: {
    gap: SPACING.xs,
  },
  tipItem: {
    lineHeight: 22,
    fontSize: 14,
  },
  
  // Camera View Styles
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  flipButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButtonText: {
    color: 'white',
    fontSize: 20,
  },
  cameraFooter: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
  },
  
  // Captured Photo Styles
  photoContainer: {
    flex: 1,
    position: 'relative',
  },
  capturedImage: {
    flex: 1,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});