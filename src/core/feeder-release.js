'use strict';

// One verified release for the shader, both client architectures and helper.
// Never mix host protocol versions. Digest supplied by GitHub's release API.
module.exports = {
  version: '1.16.0-beta.2',
  archive: ['DLSS5-Feeder-1.16.0-beta.2.zip', 'https://github.com/jlrouzies-fr/DLSS5-Feeder/releases/download/v1.16.0-beta.2/DLSS5-Feeder-1.16.0-beta.2.zip', 'b6c2a5a5e69812a91b10edb1fc84617caef4becf163b7f87960af1a802f25e0d'],
  // The overlay pins dlss5-feed.addon64 by size and digest before it will
  // drive Feeder's sliders, so the number lives here too and a build-time
  // check holds the two in step. #225 was this pin going stale unnoticed.
  addon64Size: 308224,
  hashes: {
    'dlss5-feed.addon32': 'a1978a696ead4435e6aba5fc6ab5d25d0888cfc1df12bce2d4b681e0ae2a9cd1',
    'dlss5-feed.addon64': '0994fc753af866f61cdbefc915711d73bcebec2f7c7a4404e3ebf7f199215efa',
    'dlss5-feed-host64.exe': 'dd767035c2db5d927b265c5a5663bbcf90df35d6dd6bce96eba35d3c1e0bf783',
    'reshade-shaders/Shaders/DLSS5_Feed.fx': 'cdac08a721b14b97187dd86c5b5bead157c9063d7ee859a0f131a8ee791695f1',
    // Feeder's own loader layer. A Vulkan game whose driver does not expose
    // the KHR external-interop extensions needs it for one launch.
    'layer-x64/VkLayer_feed_vk.dll': '3cf090921d6bcb5a5926c8fff5b51fc600e64f5bcbd530345c5c9e62c6213a9b',
    'layer-x64/VkLayer_feed_vk.json': 'c15967b3f8847a145e21058a1e57e92c595ee17fc5dd23ab3278b0148ad6e9d1',
    'layer-x64/run-with-feed-layer.bat': 'bc9aa7964742e23653556be978f540f503f3cef928b6de7a38f77c570bb764f9',
    'layer-x86/VkLayer_feed_vk32.dll': '44e2f1353c763e7829e7859b8b84ebb5425b64ee11dcef4a0c994aa55a511e36',
    'layer-x86/VkLayer_feed_vk32.json': '28f8174eb8fed02266bafa6910eab07922ec6d2bdb33110699c586f74b254921',
    'layer-x86/run-with-feed-layer32.bat': '75d4584ad01619402a10e0d8342b114613057a1d3b0ac8dbe9280b740090c3e8'
  }
};
