/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    void translate();

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
