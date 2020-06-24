/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef TREEMAPTAG_H
#define TREEMAPTAG_H

#include <QVector3D>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS TreeMapTag
//
//  A tag for each node in the map selector.
//
// -------------------------------------------------------

class TreeMapTag : public SuperListItem
{
public:
    TreeMapTag();
    TreeMapTag(int i, QString n);
    virtual ~TreeMapTag();
    static TreeMapTag* createDir(QString name);
    static TreeMapTag* createMap(QString name, int id);
    bool isDir() const;
    QString realName() const;
    QVector3D* position() const;
    QVector3D* positionObject() const;
    int cameraDistance() const;
    double cameraHorizontalAngle() const;
    double cameraVerticalAngle() const;
    void setCameraDistance(int d);
    void setCameraHorizontalAngle(double a);
    void setCameraVerticalAngle(double a);
    void reset();

    static void copyItem(const QStandardItem* from, QStandardItem* to);
    static void copyTree(const QStandardItem* from, QStandardItem* to);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QVector3D* m_position;
    QVector3D* m_positionObject;
    int m_cameraDistance;
    double m_cameraHorizontalAngle;
    double m_cameraVerticalAngle;
};

Q_DECLARE_METATYPE(TreeMapTag)

#endif // TREEMAPTAG_H
