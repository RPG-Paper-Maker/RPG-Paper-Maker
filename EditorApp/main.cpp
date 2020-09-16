/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QApplication>
#include <QFile>
#include <QStyleFactory>
#include <QStandardPaths>
#include <QDir>
#include <QSplashScreen>
#include "mainwindow.h"
#include "rpm.h"
#include "common.h"
#include "dialogfirstlaunch.h"
#include "dialogselectlanguage.h"
#include "controlnewproject.h"

//-------------------------------------------------
//
//  MAIN : Configurations before executing app
//
//-------------------------------------------------

int main(int argc, char *argv[]) {
    QString realApplicationName, currentApplicationName;
    QDir bin;

    // Call resource constructor to avoid stripping resources from build on
    // static linking with Engine
    // See: https://wiki.qt.io/QtResources
    Q_INIT_RESOURCE(ressources);

    // Needed for being able to use QVector<int>
    qRegisterMetaType<QVector<int>>("QVector<int>");

    // OpenGL settings before creating app
    #ifdef Q_OS_WIN
        QCoreApplication::setAttribute(Qt::AA_UseOpenGLES);
        RPM::shadersExtension = "";
    #endif
    #ifdef Q_OS_MAC
        RPM::shadersExtension = "-3.3";
        QSurfaceFormat glFormat;
        glFormat.setVersion(3, 3);
        glFormat.setProfile(QSurfaceFormat::CoreProfile);
        QSurfaceFormat::setDefaultFormat(glFormat);
    #endif

    // Application creation
    QApplication a(argc, argv);

    // The application can now be used even if called from another directory
    bin = QDir(qApp->applicationDirPath());
    #ifdef Q_OS_MAC
        bin.cdUp();
        bin.cdUp();
        bin.cdUp();
    #endif
    QDir::setCurrent(bin.absolutePath());

    // Splash screen
    QPixmap pixmap(Common::pathCombine(Common::pathCombine(QDir::currentPath(),
        RPM::FOLDER_CONTENT), "splash.png"));
    QSplashScreen splash(pixmap, Qt::WindowStaysOnTopHint);
    splash.show();
    a.processEvents();
    QTimer::singleShot(1000, &splash, &QWidget::close);

    // Detect if applciation name need to be changed according to OS
    #ifdef Q_OS_WIN
        realApplicationName = "RPG Paper Maker.exe";
    #else
        realApplicationName = "RPG-Paper-Maker";
    #endif
    currentApplicationName = QFileInfo(qApp->arguments()[0]).fileName();
    if (currentApplicationName != realApplicationName) {
        QFile fileReal(Common::pathCombine(QDir::currentPath(),
            realApplicationName));
        if (fileReal.exists()) {
            while (!fileReal.remove()) {}
        }
        QFile(Common::pathCombine(QDir::currentPath(), currentApplicationName))
            .rename(realApplicationName);
    }

    // Load RPM settings
    RPM::get()->readEngineSettings();
    RPM::get()->readTranslations();

    // General stylesheet configuration
    RPM::get()->engineSettings()->updateTheme();
    qApp->setWindowIcon(QIcon(":/icons/icon.ico"));

    // Create document folder for games if not existing
    QDir dirDocuments(QStandardPaths::writableLocation(QStandardPaths
        ::StandardLocation::DocumentsLocation));
    if (dirDocuments.exists()) {
        if (!QDir(RPM::PATH_GAMES).exists()) {
            dirDocuments.mkdir(RPM::FOLDER_GAMES);
        }
    }

    // Erase example game and refresh it
    QDir(Common::pathCombine(QDir::currentPath(), RPM::PATH_EXAMPLE_GAME))
        .removeRecursively();
    ControlNewproject::createNewProject("Example", "Example", Common
        ::pathCombine(QDir::currentPath(), RPM::PATH_EXAMPLE));
    QDir(Common::pathCombine(Common::pathCombine(Common::pathCombine(QDir
        ::currentPath(), RPM::PATH_EXAMPLE_GAME), RPM::PATH_APP), RPM
        ::PATH_DATAS)).removeRecursively();
    Common::copyPath(Common::pathCombine(QDir::currentPath(), RPM
        ::PATH_EXAMPLE_DATAS), Common::pathCombine(Common::pathCombine(Common
        ::pathCombine(QDir::currentPath(), RPM::PATH_EXAMPLE_GAME), RPM
        ::PATH_APP), RPM::PATH_DATAS));
    Common::copyPath(Common::pathCombine(Common::pathCombine(QDir::currentPath()
        , RPM::PATH_BASIC), RPM::PATH_SCRIPTS_DIR), Common::pathCombine(Common
        ::pathCombine(Common::pathCombine(QDir::currentPath(), RPM
        ::PATH_EXAMPLE_GAME), RPM::PATH_APP), RPM::PATH_SCRIPTS_DIR));

    // Opening window
    MainWindow *w = MainWindow::get();
    w->showMaximized();

    // Show first launch language selection
    DialogSelectLanguage dialogLanguage;
    if (RPM::get()->engineSettings()->firstTimeLanguages()) {
        dialogLanguage.exec();
        RPM::get()->engineSettings()->setFirstTimeLanguages(false);
        RPM::get()->engineSettings()->write();
    }

    // Show first launch window
    DialogFirstLaunch dialogFirstLaunch;
    if (RPM::get()->engineSettings()->firstTime()) {
        dialogFirstLaunch.show();
        RPM::get()->engineSettings()->setFirstTime(false);
        RPM::get()->engineSettings()->write();
    }

    // Executing
    int result = a.exec();
    delete w;
    return result;
}
