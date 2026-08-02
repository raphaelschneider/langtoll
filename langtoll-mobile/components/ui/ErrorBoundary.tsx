// Root error boundary: turns a silent Release-build render crash into readable
// on-screen text (a frozen splash tells us nothing; this tells us the line).
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    // Hardcoded on purpose — a crash screen can't lean on the theme system.
    // Values mirror design/tokens: rail navy / teal / paper ink.
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#0F161B' }} contentContainerStyle={{ padding: 24, paddingTop: 80 }}>
        <Text style={{ color: '#5CBDCD', fontSize: 20, fontWeight: '700', marginBottom: 12 }}>
          LangToll hit an error
        </Text>
        <Text selectable style={{ color: '#ECE7D8', fontSize: 15, marginBottom: 16 }}>
          {error.message}
        </Text>
        <Text selectable style={{ color: '#647579', fontSize: 12, fontFamily: 'Courier' }}>
          {error.stack}
        </Text>
      </ScrollView>
    );
  }
}
