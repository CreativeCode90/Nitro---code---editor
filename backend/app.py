from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import shutil

age = 34
name = "sd"

class FileManagerAPI:
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app)  # Allow requests from React frontend
        self.openWorkingDirectory = None
        self._register_routes()

    def _register_routes(self):
        self.app.add_url_rule("/", view_func=self.home, methods=["GET"])
        self.app.add_url_rule("/choose", view_func=self.choose, methods=["POST"])
        self.app.add_url_rule("/cd", view_func=self.cd, methods=["GET"])
        self.app.add_url_rule(
            "/makefolder", view_func=self.makefolder, methods=["POST"]
        )
        self.app.add_url_rule("/makefile", view_func=self.makefile, methods=["POST"])
        self.app.add_url_rule("/delete", view_func=self.delete, methods=["POST"])
        self.app.add_url_rule(
            "/selectFolder", view_func=self.selectFolder, methods=["POST"]
        )
        self.app.add_url_rule("/ReadFile", view_func=self.ReadFile, methods=["POST"])
        self.app.add_url_rule("/WriteFile", view_func=self.WriteFile, methods=["POST"]) 

    # ---------- ROUTES ---------- #

    def home(self):
        return "Welcome to Flask API 🚀"

    def choose(self):
        data = request.get_json()
        self.openWorkingDirectory = data["path"]
        return jsonify(
            {
                "msg": "Working directory is updated",
                "workingdir": self.openWorkingDirectory,
            }
        )

    def cd(self):
        cdlist = []
        if os.path.isdir(self.openWorkingDirectory):
            goto_dir = os.listdir(self.openWorkingDirectory)
            for item in goto_dir:
                name, ext = os.path.splitext(item)
                fullpath = os.path.join(self.openWorkingDirectory, item)
                if os.path.isdir(fullpath):
                    cdlist.append(
                        {
                            "type": "directory",
                            "name": item,
                            "path": fullpath,
                            "extension": None,
                        }
                    )
                else:
                    cdlist.append(
                        {
                            "type": "file",
                            "name": item,
                            "path": fullpath,
                            "extension": ext if ext else None,
                        }
                    )
            return jsonify(
                {
                    "msg": "Directory exists",
                    "dir": self.openWorkingDirectory,
                    "data": cdlist,
                }
            )
        else:
            return jsonify(
                {"msg": "Directory does not exist", "dir": self.openWorkingDirectory}
            )

    def makefolder(self):
        folder = request.get_json()
        newfolderpath = os.path.join(folder["rootdir"], folder["foldername"])
        os.makedirs(newfolderpath, exist_ok=True)
        return jsonify(
            {
                "msg": "Folder created",
                "foldername": folder["foldername"],
                "path": folder["rootdir"],
            }
        )

    def makefile(self):
        file = request.get_json()
        newfilepath = os.path.join(file["rootdir"], file["filename"])
        with open(newfilepath, "w") as newfile:
            pass
        return jsonify(
            {
                "msg": "File created",
                "filename": file["filename"],
                "path": file["rootdir"],
            }
        )

    def delete(self):
        data = request.get_json()
        target_path = data.get("path")

        if os.path.isfile(target_path):
            os.remove(target_path)
            return (
                jsonify(
                    {"msg": "File removed", "name": data["name"], "path": target_path}
                ),
                200,
            )

        elif os.path.isdir(target_path):
            shutil.rmtree(target_path)  # Force delete folder + contents
            return jsonify({"msg": "Folder removed", "path": target_path}), 200

        else:
            return jsonify({"msg": "Path not found"}), 404

    def selectFolder(self):
        data = request.get_json()
        target_path = data.get("path")
        cdlist = []
        if os.path.isdir(target_path):
            goto_dir = os.listdir(target_path)
            for item in goto_dir:
                name, ext = os.path.splitext(item)
                fullpath = os.path.join(target_path, item)
                if os.path.isdir(fullpath):
                    cdlist.append(
                        {
                            "type": "directory",
                            "name": item,
                            "path": fullpath,
                            "extension": None,
                        }
                    )
                else:
                    cdlist.append(
                        {
                            "type": "file",
                            "name": item,
                            "path": fullpath,
                            "extension": ext if ext else None,
                        }
                    )
            return jsonify(
                {
                    "msg": "Directory exists",
                    "dir": self.openWorkingDirectory,
                    "data": cdlist,
                }
            )
        else:
            return jsonify(
                {"msg": "Directory does not exist", "dir": self.openWorkingDirectory}
            )
    def ReadFile(self):
        try:
            filedata = request.get_json()
            
            target_path = filedata.get('path')
            if os.path.isfile(target_path):
                with open(target_path, 'r', encoding="utf-8") as readfile:
                    content = readfile.read()

                return jsonify({
                    "msg": "File read successfully",
                    "path": target_path,
                    "content": content
                }), 200
            return jsonify({
                "msg": "File does not exist",
                "path": target_path
            }      ), 404

        except Exception as e:
            return jsonify({
                "msg": "Error reading file",
                "error": str(e)
            }), 500
    def WriteFile(self):
        try:
            filedata = request.get_json()
            target_path = filedata.get("path")
            content = filedata.get("content", "")

            if os.path.isfile(target_path):
                with open(target_path, "w", encoding="utf-8") as writefile:
                    writefile.write(content)

                return jsonify({
                    "msg": "File written successfully",
                    "path": target_path,
                    "size": os.path.getsize(target_path)
                }), 200
            else:
                return jsonify({
                    "msg": "File does not exist",
                    "path": target_path
                }), 404

        except Exception as e:
            return jsonify({
                "msg": "Error writing file",
                "error": str(e)
            }), 500


if __name__ == "__main__":
    api = FileManagerAPI()
    api.app.run(debug=True)
