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
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#17171C' }} contentContainerStyle={{ padding: 24, paddingTop: 80 }}>
        <Text style={{ color: '#C8FF4D', fontSize: 20, fontWeight: '700', marginBottom: 12 }}>
          LangPass hit an error
        </Text>
        <Text selectable style={{ color: '#F4F4F7', fontSize: 15, marginBottom: 16 }}>
          {error.message}
        </Text>
        <Text selectable style={{ color: '#8A8C97', fontSize: 12, fontFamily: 'Courier' }}>
          {error.stack}
        </Text>
      </ScrollView>
    );
  }
}
