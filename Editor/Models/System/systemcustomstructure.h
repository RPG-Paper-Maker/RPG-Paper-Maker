/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMCUSTOMSTRUCTURE_H
#define SYSTEMCUSTOMSTRUCTURE_H

#include <QMetaType>
#include "superlistitem.h"

class SystemCustomStructureElement;

// -------------------------------------------------------
//
//  CLASS SystemCustomStructure
//
//  A particulary custom structure (for plugins).
//
// -------------------------------------------------------

class SystemCustomStructure : public SuperListItem
{
public:
    static const QString JSON_IS_LIST;
    static const QString JSON_PROPERTIES;
    static const QString JSON_LIST;
    static const bool DEFAULT_IS_LIST;

    SystemCustomStructure();
    SystemCustomStructure(int i, QString n, bool isList = false,
        QStandardItemModel *m = new QStandardItemModel);
    virtual ~SystemCustomStructure();
    QStandardItemModel * model() const;
    void setIsList(bool isList);

    bool isList() const;
    void initializeHeaders();
    void clearProperties();
    void clearList();
    void removeElement(SystemCustomStructureElement *element);
    void insertElementAfter(SystemCustomStructureElement *elementBefore,
        SystemCustomStructureElement *element);

    virtual QString toString() const;
    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QStandardItemModel *m_properties;
    QStandardItemModel *m_list;
};

Q_DECLARE_METATYPE(SystemCustomStructure)

#endif // SYSTEMCUSTOMSTRUCTURE_H
