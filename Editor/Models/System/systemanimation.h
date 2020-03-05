/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMANIMATION_H
#define SYSTEMANIMATION_H

#include <QMetaType>
#include "superlistitem.h"
#include "animationpositionkind.h"
#include "systempicture.h"

// -------------------------------------------------------
//
//  CLASS SystemAnimation
//
//  A particulary animation (datas).
//
// -------------------------------------------------------

class SystemAnimation : public SuperListItem
{
public:
    static const QString JSON_PICTURE_ID;
    static const QString JSON_POSITION_KIND;
    static const QString JSON_FRAMES;
    static const QString JSON_ROWS;
    static const QString JSON_COLUMNS;
    static const int DEFAULT_PICTURE_ID;
    static const AnimationPositionKind DEFAULT_POSITION_KIND;
    static const int DEFAULT_ROWS;
    static const int DEFAULT_COLUMNS;

    SystemAnimation();
    SystemAnimation(int i, QString n, int pid, AnimationPositionKind pk, int r =
        DEFAULT_ROWS, int c = DEFAULT_COLUMNS);
    virtual ~SystemAnimation();
    int pictureID() const;
    void setPictureID(int pid);
    AnimationPositionKind positionKind() const;
    void setPositionKind(AnimationPositionKind pk);
    QStandardItemModel * framesModel() const;
    int rows() const;
    void setRows(int r);
    int columns() const;
    void setColumns(int c);

    SystemPicture * picture() const;
    void correctAllPositions(AnimationPositionKind previous,
        AnimationPositionKind after);

    virtual void setDefault();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_pictureID;
    AnimationPositionKind m_positionKind;
    QStandardItemModel *m_framesModel;
    int m_rows;
    int m_columns;
};

Q_DECLARE_METATYPE(SystemAnimation)

#endif // SYSTEMANIMATION_H
