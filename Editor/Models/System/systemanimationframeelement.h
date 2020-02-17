/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMANIMATIONFRAMEELEMENT_H
#define SYSTEMANIMATIONFRAMEELEMENT_H

#include "superlistitem.h"
#include "animationpositionkind.h"

// -------------------------------------------------------
//
//  CLASS SystemAnimationFrameElement
//
//  A particulary animation frame element (datas).
//
// -------------------------------------------------------

class SystemAnimationFrameElement : public SuperListItem
{
public:
    static const QString JSON_X;
    static const QString JSON_Y;
    static const QString JSON_TEX_ROW;
    static const QString JSON_TEX_COLUMN;

    SystemAnimationFrameElement();
    SystemAnimationFrameElement(int i, QString n, int x, int y, int tr, int tc);
    virtual ~SystemAnimationFrameElement();
    int x() const;
    void setX(int x);
    int y() const;
    void setY(int y);
    int texRow() const;
    void setTexRow(int tr);
    int texColumn() const;
    void setTexColumn(int tc);

    QString getPositionString() const;
    void correctPosition(AnimationPositionKind previous, AnimationPositionKind
        after);

    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_x;
    int m_y;
    int m_texRow;
    int m_texColumn;
};

#endif // SYSTEMANIMATIONFRAMEELEMENT_H
