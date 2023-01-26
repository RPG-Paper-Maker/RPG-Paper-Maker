/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMFONT_H
#define SYSTEMFONT_H

#include <QMetaType>
#include "systemresource.h"

// -------------------------------------------------------
//
//  CLASS SystemFont
//
//  A particulary font.
//
// -------------------------------------------------------

class SystemFont : public SystemResource
{
public:
    SystemFont();
    SystemFont(int i, QString n, bool isBR, QString dlc = "");
    virtual ~SystemFont();

    bool isBR() const;
    void setIsBR(bool b);

    static SystemFont * getByID(int id);
    static QString getFolder(bool isBR = false, QString dlc = "");
    static QString getLocalFolder();

    QString getCSS(QString name) const;

    virtual QString getPath() const;
    virtual QString getLocalPath() const;
    virtual SuperListItem * createCopy() const;
};

#endif // SYSTEMFONT_H
