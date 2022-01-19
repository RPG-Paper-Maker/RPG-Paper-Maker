/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGJUMP_H
#define DIALOGJUMP_H

#include <QDialog>
#include <QStandardItemModel>
#include "eventcommand.h"

namespace Ui {
class DialogJump;
}

class DialogJump : public QDialog
{
    Q_OBJECT

public:
    explicit DialogJump(QStandardItemModel *properties, QStandardItemModel
        *parameters, QWidget *parent = nullptr);
    ~DialogJump();

    void getCommand(QVector<QString> &command) const;
    void initializePrimitives();
    void initialize(QVector<QString> &commands);
    void translate();

private:
    Ui::DialogJump *ui;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
};

#endif // DIALOGJUMP_H
