/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef DIALOGSETMAXIMUM_H
#define DIALOGSETMAXIMUM_H

#include <QDialog>
#include <QStandardItemModel>

// -------------------------------------------------------
//
//  CLASS DialogSetMaximum
//
//  A dialog used for setting the maximum number of items in
//  a super list.
//
// -------------------------------------------------------

namespace Ui {
class DialogSetMaximum;
}

class DialogSetMaximum : public QDialog
{
    Q_OBJECT

public:
    static const QString STR_WARNING;

    explicit DialogSetMaximum(QStandardItemModel* model, int max,
                              QWidget *parent = nullptr);
    ~DialogSetMaximum();
    int maximum() const;

    static bool isOrderedMax(QStandardItemModel* model, int limit);

private:
    Ui::DialogSetMaximum *ui;
    QStandardItemModel* m_model;

    bool isOrdered(int limit) const;

private slots:
    void accept();
};

#endif // DIALOGSETMAXIMUM_H
