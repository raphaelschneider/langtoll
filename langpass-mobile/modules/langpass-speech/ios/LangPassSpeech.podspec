Pod::Spec.new do |s|
  s.name           = 'LangPassSpeech'
  s.version        = '1.0.0'
  s.summary        = 'Native AVSpeechSynthesizer with buffer rendering, EQ and de-essing'
  s.description    = 'Renders speech to a PCM buffer and plays it through an AVAudioEngine EQ chain.'
  s.author         = 'LangPass'
  s.homepage       = 'https://langpass.app'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }
  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
