/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#include <QApplication>
#include <QFile>
#include <QStyleFactory>
#include <QStandardPaths>
#include <QDir>
#include "mainwindow.h"
#include "rpm.h"
#include "common.h"

//-------------------------------------------------
//
//  MAIN
//
//-------------------------------------------------

int main(int argc, char *argv[])
{
    qRegisterMetaType<QVector<int>>("QVector<int>");

    #ifdef Q_OS_WIN
        QCoreApplication::setAttribute(Qt::AA_UseOpenGLES);
        RPM::shadersExtension = "";
    #endif

    QApplication a(argc, argv);

    //EngineUpdater::writeTrees();

    // The application can now be used even if called from another directory
    QDir bin(qApp->applicationDirPath());
    #ifdef Q_OS_MAC
        bin.cdUp();
        bin.cdUp();
        bin.cdUp();
    #endif
    QDir::setCurrent(bin.absolutePath());

    // Detect if applciation name need to be changed
    QString realApplicationName;
    #ifdef Q_OS_WIN
        realApplicationName = "RPG Paper Maker.exe";
    #elif __linux__
        realApplicationName = "RPG-Paper-Maker";
    #else
        realApplicationName = "RPG-Paper-Maker.app";
    #endif
    QString currentApplicationName = QFileInfo(qApp->arguments()[0]).fileName();

    if (currentApplicationName != realApplicationName) {
        QString pathReal = Common::pathCombine(QDir::currentPath(),
            realApplicationName);
        QFile fileReal(pathReal);
        if (fileReal.exists()) {
            while (!fileReal.remove()) {}
        }
        QFile(Common::pathCombine(QDir::currentPath(), currentApplicationName))
            .rename(realApplicationName);
    }

    // Load engine settings
    EngineSettings *engineSettings = new EngineSettings;
    QFile fileSettings(Common::pathCombine(QDir::currentPath(),
        RPM::pathEngineSettings));
    if (fileSettings.exists()) {
        engineSettings->read();
    } else {
        engineSettings->setDefault();
        engineSettings->write();
    }
    RPM::get()->setEngineSettings(engineSettings);

    // General stylesheet configuration
    engineSettings->updateTheme();
    qApp->setWindowIcon(QIcon(":/icons/Ressources/icon.ico"));

    // Create document folder for games if not existing
    QString documentsPath = QStandardPaths::writableLocation(
        QStandardPaths::StandardLocation::DocumentsLocation);
    QDir dirDocuments(documentsPath);
    if (dirDocuments.exists()) {
        QString gamesPath = RPM::dirGames;
        QDir dirGames(gamesPath);
        if (!dirGames.exists()) {
            dirDocuments.mkdir(RPM::gamesFolderName);
        }

    }

    // Opening window
    MainWindow w;
    w.showMaximized();

    // Executing
    return a.exec();
}
