// FileSystem加载失败回调
function onErrorLoadFs(error) {
  console.warn('文件系统加载失败！', error);
}

// 文件夹创建失败回调
function onErrorGetDir(error) {
  console.warn('文件夹创建失败！', error);
}

// 文件创建失败回调
function onErrorCreateFile(error) {
  console.warn('文件创建失败！', error);
}

// 读取文件失败响应
function onErrorReadFile(error) {
  console.warn('文件读取失败!', error);
}

// 删除文件失败响应
function onErrorDeleteFile(error) {
  console.warn('文件删除失败!', error);
}

// 将内容数据写入到文件中
function writeFile(fileEntry, dataObj) {
  // 创建一个写入对象
  fileEntry.createWriter(fileWriter => {
    // 文件写入成功
    fileWriter.onwriteend = () => {
      // console.debug('Successful file write...');
    };

    // 文件写入失败
    fileWriter.onerror = e => {
      console.warn(`Failed file write: ${e.toString()}`);
    };

    // 写入文件
    // console.debug(`fileWriter length>>>${fileWriter.length}`);
    fileWriter.seek(fileWriter.length); // Start write position at EOF.
    fileWriter.write(dataObj);
  });
}

// 读取文件
function readFile(fileEntry, onSuccess) {
  fileEntry.file(file => {
    const reader = new FileReader();
    reader.onloadend = function() {
      console.debug(`file read success: ${this.result}`);
      if (onSuccess) {
        onSuccess(`${this.result}`);
      }
    };
    reader.readAsText(file);
  }, onErrorReadFile);
}

const rootDir = 'rootDir';
export const logFileName = 'sample.log';

export function createAndWriteFile(fileName, tasksStr) {
  window.requestFileSystem(
    window.LocalFileSystem.PERSISTENT,
    0,
    fs => {
      // console.debug(`打开的文件系统: ${fs.name}`);
      fs.root.getDirectory(
        rootDir,
        { create: true },
        dirEntry => {
          dirEntry.getFile(
            fileName,
            { create: true, exclusive: false },
            fileEntry => {
              // 文件内容
              const dataObj = new Blob([`${tasksStr}\n`], { type: 'text/plain' });
              // console.warn('writing', tasksStr);
              // 写入文件
              writeFile(fileEntry, dataObj);
            },
            onErrorCreateFile
          );
        },
        onErrorGetDir
      );
    },
    onErrorLoadFs
  );
}

export function getAndReadFile(fileName, onSuccess) {
  window.requestFileSystem(
    window.LocalFileSystem.PERSISTENT,
    0,
    fs => {
      // console.debug(`打开的文件系统: ${fs.name}`);
      fs.root.getDirectory(
        rootDir,
        { create: false },
        dirEntry => {
          dirEntry.getFile(
            fileName,
            { create: false, exclusive: false },
            fileEntry => {
              console.debug(`是否是个文件？${fileEntry.isFile.toString()}`);
              readFile(fileEntry, onSuccess);
            },
            onErrorCreateFile
          );
        },
        onErrorGetDir
      );
    },
    onErrorLoadFs
  );
}

export function deleteFile(fileName) {
  window.requestFileSystem(
    window.LocalFileSystem.PERSISTENT,
    0,
    fs => {
      fs.root.getDirectory(
        rootDir,
        { create: false },
        dirEntry => {
          dirEntry.getFile(
            fileName,
            { create: false },
            fileEntry => {
              console.debug(`是否是个文件？${fileEntry.isFile.toString()}`);
              fileEntry.remove(() => {
                console.debug('File removed.');
              }, onErrorDeleteFile);
            },
            onErrorCreateFile
          );
        },
        onErrorGetDir
      );
    },
    onErrorLoadFs
  );
}

export function getFileSize(fileName, onSuccess) {
  window.requestFileSystem(
    window.LocalFileSystem.PERSISTENT,
    0,
    fs => {
      // console.debug(`打开的文件系统: ${fs.name}`);
      fs.root.getDirectory(
        rootDir,
        { create: false },
        dirEntry => {
          dirEntry.getFile(
            fileName,
            { create: false, exclusive: false },
            fileEntry => {
              console.debug(`是否是个文件？${fileEntry.isFile.toString()}`);
              fileEntry.getMetadata(metadata => {
                onSuccess(metadata.size);
              });
            },
            onErrorCreateFile
          );
        },
        onErrorGetDir
      );
    },
    onErrorLoadFs
  );
}
