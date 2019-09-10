/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMFONTSIZE_H
#define SYSTEMFONTSIZE_H

#include <QMetaType>
#include "superlistitem.h"
#include "primitivevalue.h"

// -------------------------------------------------------
//
//  CLASS SystemFontSize
//
//  A particulary font size (datas).
//
// -------------------------------------------------------

class SystemFontSize : public SuperListItem
{
public:
    static const QString JSON_SIZE;

    SystemFontSize();
    SystemFontSize(int i, QString n, PrimitiveValue *s);
    virtual ~SystemFontSize();

    PrimitiveValue * size() const;

    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    PrimitiveValue *m_size;
};

Q_DECLARE_METATYPE(SystemFontSize)

#endif // SYSTEMFONTSIZE_H
