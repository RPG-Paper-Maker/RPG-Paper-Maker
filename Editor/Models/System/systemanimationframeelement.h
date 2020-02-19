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
    static const QString JSON_ZOOM;
    static const QString JSON_ANGLE;
    static const QString JSON_FLIP_VERTICALY;
    static const QString JSON_OPACITY;
    static const int DEFAULT_X;
    static const int DEFAULT_Y;
    static const int DEFAULT_TEX_ROW;
    static const int DEFAULT_TEX_COLUMN;
    static const double DEFAULT_ZOOM;
    static const double DEFAULT_ANGLE;
    static const bool DEFAULT_FLIP_VERTICALY;
    static const double DEFAULT_OPACITY;

    SystemAnimationFrameElement();
    SystemAnimationFrameElement(int i, QString n, int x, int y, int tr, int tc,
        double z = DEFAULT_ZOOM, double a = DEFAULT_ANGLE, bool fv =
        DEFAULT_FLIP_VERTICALY, double o = DEFAULT_OPACITY);
    virtual ~SystemAnimationFrameElement();
    int x() const;
    void setX(int x);
    int y() const;
    void setY(int y);
    int texRow() const;
    void setTexRow(int tr);
    int texColumn() const;
    void setTexColumn(int tc);
    double zoom() const;
    void setZoom(double z);
    double angle() const;
    void setAngle(double a);
    bool flipVerticaly() const;
    void setFlipVerticaly(bool fv);
    double opacity() const;
    void setOpacity(double o);

    QString getPositionString() const;
    void correctPosition(AnimationPositionKind previous, AnimationPositionKind
        after);

    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_x;
    int m_y;
    int m_texRow;
    int m_texColumn;
    double m_zoom;
    double m_angle;
    bool m_flipVerticaly;
    double m_opacity;
};

#endif // SYSTEMANIMATIONFRAMEELEMENT_H
