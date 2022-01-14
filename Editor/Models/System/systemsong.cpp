/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemsong.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemSong::SystemSong() :
    SystemSong(-1, "<" + RPM::translate(Translations::NONE) + ">", false)
{

}

SystemSong::SystemSong(int i, QString n, bool isBR, QString dlc, SongKind kind) :
    SystemResource(i, n, isBR, dlc),
    m_kind(kind)
{

}

SystemSong::~SystemSong()
{

}

void SystemSong::setKind(SongKind kind)
{
    m_kind = kind;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString SystemSong::getFolder(SongKind kind, bool isBR, QString dlc)
{
    return Common::pathCombine(SystemResource::getFolder(isBR, dlc),
        SystemSong::getLocalFolder(kind));
}

// -------------------------------------------------------

QString SystemSong::getLocalFolder(SongKind kind){
    switch (kind){
    case SongKind::Music:
        return RPM::PATH_MUSICS;
    case SongKind::BackgroundSound:
        return RPM::PATH_BACKGROUND_SOUNDS;
    case SongKind::Sound:
        return RPM::PATH_SOUNDS;
    case SongKind::MusicEffect:
        return RPM::PATH_MUSIC_EFFECTS;
    default:
        return "";
    }
}

// -------------------------------------------------------

QString SystemSong::getSongTitle(SongKind kind) {
    switch(kind) {
    case SongKind::Music:
        return RPM::translate(Translations::MUSICS);
    case SongKind::BackgroundSound:
        return RPM::translate(Translations::BACKGROUND_SOUNDS);
    case SongKind::Sound:
        return RPM::translate(Translations::SOUNDS);
    case SongKind::MusicEffect:
        return RPM::translate(Translations::MUSIC_EFFECTS);
    default:
        return "";
    }
}

// -------------------------------------------------------

QString SystemSong::getPath() const
{
    if (id() == -1)
        return "";

    QString folder = getFolder(m_kind, m_isBR, m_dlc);

    return Common::pathCombine(folder, name());
}

// -------------------------------------------------------

QString SystemSong::getLocalPath() const
{
    QString folder = getLocalFolder(m_kind);

    return Common::pathCombine(folder, name());
}

// -------------------------------------------------------

SuperListItem* SystemSong::createCopy() const{
    SystemSong* super = new SystemSong;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemSong::setCopy(const SuperListItem &super) {
    const SystemSong *song;

    SystemResource::setCopy(super);

    song = reinterpret_cast<const SystemSong *>(&super);
    m_kind = song->m_kind;
}
