Pod::Spec.new do |s|
  s.name           = 'LangTollActivity'
  s.version        = '1.0.0'
  s.summary        = 'ActivityKit bridge for the pass-countdown Live Activity'
  s.description    = 'Starts, replaces and ends the LangToll pass Live Activity from JS.'
  s.author         = 'LangToll'
  s.homepage       = 'https://langtoll.app'
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
