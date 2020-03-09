/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
        textHeal, QRectF textCritical, QRectF textMiss);
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
    virtual void setCopy(const SuperListItem &super);
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
