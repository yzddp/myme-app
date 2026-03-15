/**
 * MyMe App - Avatar Create Screen
 * 创建分身页面
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Chip, SegmentedButtons } from 'react-native-paper';
import { COLORS } from '../../constants/colors';

const SCENARIOS = [
  { value: 'interview', label: '面试' },
  { value: 'work', label: '工作' },
  { value: 'dating', label: '相亲' },
  { value: 'consultation', label: '咨询' },
];

const MODULES = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10'];

export default function AvatarCreateScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [scenario, setScenario] = useState('interview');
  const [permissions, setPermissions] = useState<string[]>([]);

  const togglePermission = (module: string) => {
    if (permissions.includes(module)) {
      setPermissions(permissions.filter(p => p !== module));
    } else {
      setPermissions([...permissions, module]);
    }
  };

  const handleCreate = () => {
    // TODO: 调用创建分身API
    console.log({ name, description, scenario, permissions });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>创建分身</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          label="分身名称"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="描述"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <Text style={styles.label}>应用场景</Text>
        <SegmentedButtons
          value={scenario}
          onValueChange={setScenario}
          buttons={SCENARIOS}
          style={styles.segmented}
        />

        <Text style={styles.label}>授权模块 (M1-M10)</Text>
        <Text style={styles.hint}>选择分身可以访问的知识模块</Text>
        <View style={styles.moduleList}>
          {MODULES.map((module) => (
            <Chip
              key={module}
              selected={permissions.includes(module)}
              onPress={() => togglePermission(module)}
              style={[
                styles.moduleChip,
                permissions.includes(module) && styles.moduleChipSelected,
              ]}
              textStyle={permissions.includes(module) ? styles.moduleChipTextSelected : undefined}
            >
              {module}
            </Chip>
          ))}
        </View>

        <Button
          mode="contained"
          onPress={handleCreate}
          style={styles.button}
          disabled={!name || permissions.length === 0}
        >
          创建分身
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    paddingTop: 48,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textOnPrimary,
  },
  form: {
    padding: 20,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
    marginTop: 8,
  },
  hint: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  segmented: {
    marginBottom: 16,
  },
  moduleList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  moduleChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  moduleChipSelected: {
    backgroundColor: COLORS.primary,
  },
  moduleChipTextSelected: {
    color: COLORS.textOnPrimary,
  },
  button: {
    marginTop: 16,
  },
});
