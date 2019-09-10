/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMFONTNAME_H
#define SYSTEMFONTNAME_H

#include <QMetaType>
#include "superlistitem.h"
#include "primitivevalue.h"

// -------------------------------------------------------
//
//  CLASS SystemFontName
//
//  A particulary font name (datas).
//
// -------------------------------------------------------

class SystemFontName : public SuperListItem
{
public:
    static const QString JSON_FONT;
    static const QString DEFAULT_FONT;

    SystemFontName();
    SystemFontName(int i, QString n, PrimitiveValue *f);
    virtual ~SystemFontName();

    PrimitiveValue * font() const;

    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    PrimitiveValue * m_font;
};

Q_DECLARE_METATYPE(SystemFontName)

#endif // SYSTEMFONTNAME_H
