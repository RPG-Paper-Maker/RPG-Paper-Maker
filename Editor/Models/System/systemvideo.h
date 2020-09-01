/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMVIDEO_H
#define SYSTEMVIDEO_H

#include <QMetaType>
#include "systemresource.h"

// -------------------------------------------------------
//
//  CLASS SystemVideo
//
//  A particulary video.
//
// -------------------------------------------------------

class SystemVideo : public SystemResource
{
public:
    SystemVideo();
    SystemVideo(int i, QString n, bool isBR, QString dlc = "");
    virtual ~SystemVideo();

    bool isBR() const;
    void setIsBR(bool b);

    static SystemVideo * getByID(int id);
    static QString getFolder(bool isBR = false, QString dlc = "");
    static QString getLocalFolder();

    virtual QString getPath() const;
    virtual QString getLocalPath() const;
    virtual SuperListItem * createCopy() const;
};

#endif // SYSTEMVIDEO_H
