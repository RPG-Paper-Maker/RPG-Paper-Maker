/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemvideo.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemVideo::SystemVideo() :
    SystemVideo(-1, "<" + RPM::translate(Translations::NONE) + ">", false)
{

}

SystemVideo::SystemVideo(int i, QString n, bool isBR, QString dlc) :
    SystemResource(i, n, isBR, dlc)
{

}

SystemVideo::~SystemVideo() {

}

bool SystemVideo::isBR() const {
    return m_isBR;
}

void SystemVideo::setIsBR(bool b) {
    m_isBR = b;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SystemVideo * SystemVideo::getByID(int id) {
    return reinterpret_cast<SystemVideo *>(SuperListItem::getById(RPM::get()
        ->project()->videosDatas()->model()->invisibleRootItem(), id));
}

// -------------------------------------------------------

QString SystemVideo::getFolder(bool isBR, QString dlc) {
    return Common::pathCombine(SystemResource::getFolder(isBR, dlc),
        SystemVideo::getLocalFolder());
}

// -------------------------------------------------------

QString SystemVideo::getLocalFolder() {
    return RPM::PATH_VIDEOS;
}

// -------------------------------------------------------

QString SystemVideo::getPath() const {
    if (id() == -1) {
        return "";
    }

    QString folder = getFolder(m_isBR, m_dlc);

    return Common::pathCombine(folder, name());
}

// -------------------------------------------------------

QString SystemVideo::getLocalPath() const {
    QString folder = getLocalFolder();

    return Common::pathCombine(folder, name());
}

// -------------------------------------------------------
//
// VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

SuperListItem * SystemVideo::createCopy() const {
    SystemVideo *super = new SystemVideo;
    super->setCopy(*this);
    return super;
}
