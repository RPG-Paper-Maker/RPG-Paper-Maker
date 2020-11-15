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

// -------------------------------------------------------
//
//  CLASS SystemCustomStructure
//
//  A particulary custom structure (for plugins).
//
// -------------------------------------------------------

class PrimitiveValue;

class SystemCustomStructure : public SuperListItem
{
public:
    static const QString JSON_IS_LIST;
    static const QString JSON_PROPERTIES;
    static const QString JSON_LIST;
    static const bool DEFAULT_IS_LIST;

    SystemCustomStructure();
    SystemCustomStructure(int i, QString n, PrimitiveValue *v = nullptr, bool
        il = DEFAULT_IS_LIST, QStandardItemModel *p = nullptr,
        QStandardItemModel *l = nullptr);
    virtual ~SystemCustomStructure();
    PrimitiveValue * value();
    bool isList() const;
    QStandardItemModel * properties() const;
    QStandardItemModel * list() const;
    void setIsList(bool isList);

    void initializeHeaders();
    void clearProperties();
    void clearList();

    virtual QString toString() const;
    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    PrimitiveValue *m_value;
    bool m_isList;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_list;
};

Q_DECLARE_METATYPE(SystemCustomStructure)

#endif // SYSTEMCUSTOMSTRUCTURE_H
