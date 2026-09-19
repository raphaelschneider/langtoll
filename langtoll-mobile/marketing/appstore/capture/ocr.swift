import Foundation
import Vision
import AppKit

// usage: ocr <image> ...   → prints "path<TAB>line" for each recognized line
for path in CommandLine.arguments.dropFirst() {
  guard let img = NSImage(contentsOfFile: path),
        let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { continue }
  let req = VNRecognizeTextRequest()
  req.recognitionLevel = .accurate
  req.usesLanguageCorrection = false
  try? VNImageRequestHandler(cgImage: cg).perform([req])
  for obs in req.results ?? [] {
    if let s = obs.topCandidates(1).first?.string { print("\(path)\t\(s)") }
  }
}
