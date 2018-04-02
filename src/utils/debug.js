
const notify = (name, message, mataData)=>{
	window.fundebug.notify(name, message, { mataData })
}
const notifyError = (error, mataData)=>{
	window.fundebug.notifyError(error, { mataData })
}


class XcallDebug {

  get log() {
    return notify;
  }

  get error() {
  	return notifyError;
  }
}

const xcallDebug = new XcallDebug();

export default xcallDebug;