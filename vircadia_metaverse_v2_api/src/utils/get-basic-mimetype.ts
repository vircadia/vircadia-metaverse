//   Copyright 2020 Vircadia Contributors
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

'use strict';

// TODO: Can we format this to be non-nested and not on one line?
export default (mimeType: string): string => {
    if (mimeType.includes('application/dash+xml')) {
        return 'video';
    } else if (mimeType.includes('application/x-mpegURL')) {
        return 'video';
    } else if (mimeType.includes('image')) {
        return 'image';
    } else if (mimeType.includes('video')) {
        return 'video';
    } else if (mimeType.includes('audio')) {
        return 'audio';
    } else if (mimeType.includes('text')) {
        return 'text';
    } else if (mimeType.includes('model')) {
        return 'model';
    } else {
        return 'application';
    }
};
