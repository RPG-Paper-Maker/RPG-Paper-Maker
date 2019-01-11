/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#ifndef SYSTEMWINDOWSKIN_H
#define SYSTEMWINDOWSKIN_H

#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemWindowSkin
//
//  A particulary window skin (design for dialog boxes).
//
// -------------------------------------------------------

class SystemWindowSkin : public SuperListItem
{
public:
    static const QString JSON_PICTURE_ID;
    static const QString JSON_TOP_LEFT;

    SystemWindowSkin();
    SystemWindowSkin(int i, QString n, int pictureID, QRectF topLeft);
    virtual ~SystemWindowSkin();
    int pictureID() const;
    void setPictureID(int id);
    QRectF * topLeft();

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemWindowSkin &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_pictureID;
    QRectF m_topLeft;
    QRectF m_topRight;
    QRectF m_botLeft;
    QRectF m_botRight;
    QRectF m_left;
    QRectF m_right;
    QRectF m_top;
    QRectF m_bot;
    QRectF m_background;
    bool m_backgroudRepeat;
    QRectF m_arrowEndMessage;
    QRectF m_arrowTargetSelection;
    QRectF m_arrowUpDown;
    QRectF m_textNormal;
    QRectF m_textCritical;
    QRectF m_textHeal;
    QRectF m_textMiss;
};

Q_DECLARE_METATYPE(SystemWindowSkin)

#endif // SYSTEMWINDOWSKIN_H
