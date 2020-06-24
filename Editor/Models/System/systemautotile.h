/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMAUTOTILE_H
#define SYSTEMAUTOTILE_H

#include <QMetaType>
#include "systemspecialelement.h"

// -------------------------------------------------------
//
//  CLASS SystemAutotile
//
//  A particulary autotile (special element).
//
// -------------------------------------------------------

class SystemAutotile : public SystemSpecialElement
{
public:
    SystemAutotile();
    SystemAutotile(int i, QString n, int pictureId);
    virtual ~SystemAutotile();
    static int NUMBER_ROWS;
    static int NUMBER_COLUMNS;
    static int getPreviewWidth(QImage& image);
    static int getPreviewHeight(QImage& image);
    static int getPreviewColumns(QImage& image);
    static int getPreviewRows(QImage& image);
    static int getPreviewSize(int size);

    virtual SystemPicture* picture() const;
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
};

Q_DECLARE_METATYPE(SystemAutotile)

#endif // SYSTEMAUTOTILE_H
