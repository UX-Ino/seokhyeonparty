import { deleteAsync } from "del";
import {
  __dirname,
  isBuild,
  destFolder,
  srcFolder,
  projectPaths,
} from "../config/paths.js";

const reset = () => {
  if(destFolder.includes('react')){
    return deleteAsync([destFolder + '/assets', destFolder + '/guide', destFolder + '/pages']);
  }
  return deleteAsync(destFolder)
};

export { reset };
