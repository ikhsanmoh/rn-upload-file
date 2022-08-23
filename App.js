/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import RNFetchBlob from 'rn-fetch-blob';
import DocumentPicker from 'react-native-document-picker';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [singleFile, setSingleFile] = useState(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const selectFile = async () => {
    // Opening Document Picker to select one file
    try {
      const res = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.allFiles],
        // There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      // Printing the log realted to the file
      console.log('res : ', res[0]);
      // Setting the state to show single file attributes
      setSingleFile(res[0]);
    } catch (err) {
      setSingleFile(null);
      // Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
        alert('Canceled');
      } else {
        // For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const handleSend = async () => {
    if (singleFile !== null) {
      console.log('Sending...');

      const selectedFile = singleFile;

      RNFetchBlob.fetch(
        'POST',
        'https://80f5-36-90-253-199.ap.ngrok.io/ext/cvoidart-form.php',
        {
          Authorization: 'Bearer access-token',
          'Content-Type': 'multipart/form-data',
        },
        [
          {
            name: 'photo',
            filename: selectedFile.name,
            type: selectedFile.type,
            data: RNFetchBlob.wrap(selectedFile.uri),
          },
          {name: 'date', data: '2022-08-23'},
          {name: 'result', data: '1'},
        ],
      )
        .then(resp => {
          console.log('res => ', JSON.parse(resp.data));
        })
        .catch(err => {
          console.log('error => ', err);
        });
    } else {
      // If no file selected the show alert
      alert('Please Select File first');
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.view}>
        <Text>Test</Text>
        <TouchableOpacity
          style={[styles.button, styles.buttonSelect]}
          onPress={selectFile}>
          <Text style={styles.buttonText}>Select File</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSend} style={styles.button}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'green',
    borderRadius: 8,
    margin: 8,
  },
  buttonSelect: {
    backgroundColor: 'blue',
  },
  buttonText: {
    color: 'white',
  },
});

export default App;
