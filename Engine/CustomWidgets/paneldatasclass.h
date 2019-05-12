/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef PANELDATASCLASS_H
#define PANELDATASCLASS_H

#include <QWidget>
#include "systemclass.h"

// -------------------------------------------------------
//
//  CLASS PanelDatasClass
//
//  A panel used for classes, heroes, and monsters.
//
// -------------------------------------------------------

namespace Ui {
class PanelDatasClass;
}

class PanelDatasClass : public QWidget
{
    Q_OBJECT

public:
    static const QString NAME_EXPERIENCE;

    explicit PanelDatasClass(QWidget *parent = nullptr);
    ~PanelDatasClass();
    int finalLevel() const;

    void initialize(bool isClass = true);
    void update(SystemClass *sysClass, SystemClass *originalClass);

protected:
    bool eventFilter(QObject *o, QEvent *e);

private:
    Ui::PanelDatasClass *ui;
    SystemClass *m_class;
    SystemClass *m_originalClass;
    bool m_updating;

    int getInheritValue(int v1, int v2);
    void updateExperience();

public slots:
    void on_spinBoxClassInitialLevel_valueChanged(int i);
    void on_spinBoxClassMaxLevel_valueChanged(int i);
    void on_spinBoxClassBase_valueChanged(int i);
    void on_spinBoxClassInflation_valueChanged(int i);
    void on_pushButtonReset_clicked();
    void on_pushButtonSetClassValues_clicked();

signals:
    void maxLevelUpdated(int lvl);
};

#endif // PANELDATASCLASS_H
