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
    static const QString JSON_TOP_RIGHT;
    static const QString JSON_BOT_LEFT;
    static const QString JSON_BOT_RIGHT;
    static const QString JSON_LEFT;
    static const QString JSON_RIGHT;
    static const QString JSON_TOP;
    static const QString JSON_BOT;
    static const QString JSON_BACKGROUND;
    static const QString JSON_BACKGROUND_SELECTION;
    static const QString JSON_BACKGROUND_REPEAT;
    static const QString JSON_ARROW_END_MESSAGE;
    static const QString JSON_ARROW_TARGET_SELECTION;
    static const QString JSON_ARROW_UP_DOWN;
    static const QString JSON_TEXT_NORMAL;
    static const QString JSON_TEXT_CRITICAL;
    static const QString JSON_TEXT_HEAL;
    static const QString JSON_TEXT_MISS;

    SystemWindowSkin();
    SystemWindowSkin(int i, QString n, int pictureID, QRectF topLeft, QRectF
        topRight, QRectF botLeft, QRectF botRight, QRectF left, QRectF right,
        QRectF top, QRectF bot, QRectF background, QRectF backgroundSelection,
        bool backgroundRepeat, QRectF arrowEndMessage, QRectF
        arrowTargetSelection, QRectF arrowUpDown, QRectF textNormal, QRectF
        textCritical, QRectF textHeal, QRectF textMiss);
    virtual ~SystemWindowSkin();
    int pictureID() const;
    void setPictureID(int id);
    QRectF * topLeft();
    QRectF * topRight();
    QRectF * botLeft();
    QRectF * botRight();
    QRectF * left();
    QRectF * right();
    QRectF * top();
    QRectF * bot();
    QRectF * background();
    QRectF * backgroundSelection();
    bool backgroudRepeat();
    void setBackgroundRepeat(bool b);
    QRectF * arrowEndMessage();
    QRectF * arrowTargetSelection();
    QRectF * arrowUpDown();
    QRectF * textNormal();
    QRectF * textCritical();
    QRectF * textHeal();
    QRectF * textMiss();

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
    QRectF m_backgroundSelection;
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
