/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef SYSTEMMONSTER_H
#define SYSTEMMONSTER_H

#include "systemhero.h"
#include "systemprogressiontable.h"

// -------------------------------------------------------
//
//  CLASS SystemMonster
//
//  A particulary monster (datas).
//
// -------------------------------------------------------

class SystemMonster : public SystemHero
{
public:
    static const QString JSON_EXPERIENCE;
    static const QString JSON_CURRENCIES;
    static const QString JSON_LOOTS;

    SystemMonster();
    SystemMonster(int i, LangsTranslation* names, int idClass, int idBattler,
        int idFaceset, SystemClass *classInherit, SystemProgressionTable *exp,
        QStandardItemModel *loots, QStandardItemModel *actions);
    virtual ~SystemMonster();
    SystemProgressionTable * experience() const;
    QHash<int, SystemProgressionTable *> * currencies();
    QStandardItemModel* modelLoots() const;
    QStandardItemModel* modelActions() const;

    void deleteCurrencies();
    void insertCurrency(int id, SystemProgressionTable *table);
    void insertDefaultCurrency(int id);
    void removeCurrency(int id);
    SystemProgressionTable *currencyProgressionAt(int id);

    virtual SuperListItem* createCopy() const;
    void setCopy(const SystemMonster& monster);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    SystemProgressionTable *m_experience;
    QHash<int, SystemProgressionTable *> m_currencies;
    QStandardItemModel *m_modelLoots;
    QStandardItemModel *m_modelActions;
};

Q_DECLARE_METATYPE(SystemMonster)

#endif // SYSTEMMONSTER_H
