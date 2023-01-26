/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMANIMATIONFRAME_H
#define SYSTEMANIMATIONFRAME_H

#include <QMetaType>
#include "systemanimationframeelement.h"

// -------------------------------------------------------
//
//  CLASS SystemAnimationFrame
//
//  A particulary animation frame (datas).
//
// -------------------------------------------------------

class SystemAnimationFrame : public SuperListItem
{
public:
    static const QString JSON_ELEMENTS;
    static const QString JSON_EFFECTS;

    SystemAnimationFrame();
    SystemAnimationFrame(int i, QString n);
    virtual ~SystemAnimationFrame();
    int elementsCount() const;
    SystemAnimationFrameElement * elementAt(int i) const;
    QStandardItemModel * modelEffects() const;

    int getElementMaxIndex() const;
    void clear();
    void clearElements();
    void initializeHeader();
    SystemAnimationFrameElement * addElement(int x, int y, int row, int column);
    void addElement(SystemAnimationFrameElement *element);
    void deleteElement(SystemAnimationFrameElement *element);
    void reorder(SystemAnimationFrameElement *element);
    QList<SystemAnimationFrameElement *> getAllElementsWithID(int id);

    virtual void setDefault();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QList<SystemAnimationFrameElement *> m_elements;
    QStandardItemModel *m_modelEffects;
};

Q_DECLARE_METATYPE(SystemAnimationFrame)

#endif // SYSTEMANIMATIONFRAME_H
