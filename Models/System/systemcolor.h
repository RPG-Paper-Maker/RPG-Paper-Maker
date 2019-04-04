/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef SYSTEMCOLOR_H
#define SYSTEMCOLOR_H

#include <QStandardItemModel>
#include <QMetaType>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemColor
//
//  A particulary color (datas).
//
// -------------------------------------------------------

class SystemColor : public SuperListItem
{
public:
    static const QString JSON_R;
    static const QString JSON_G;
    static const QString JSON_B;
    static const QString JSON_A;

    SystemColor();
    SystemColor(int i, QString n, int r, int g, int b, int a);
    virtual ~SystemColor();

    QColor color() const;
    void setColor(QColor& color);

    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SystemColor &color);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QColor m_color;
};

Q_DECLARE_METATYPE(SystemColor)

#endif // SYSTEMCOLOR_H
